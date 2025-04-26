const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  // Only clients can create appointments
  if (req.user.role !== 'client') {
    return res
      .status(403)
      .json({ message: 'Only clients can create appointments' });
  }

  const { title, date, notes, professionalId } = req.body;

  try {
    // Validate required fields
    if (!title || !date || !professionalId) {
      return res.status(400).json({
        message:
          'Missing required fields: title, date, and professionalId are required',
      });
    }

    const professional = await User.findById(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Check for existing appointments at the same time with the same professional
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      professional: professionalId,
      date: {
        $gte: new Date(
          appointmentDate.setMinutes(appointmentDate.getMinutes() - 1)
        ),
        $lte: new Date(
          appointmentDate.setMinutes(appointmentDate.getMinutes() + 2)
        ),
      },
      status: { $ne: 'canceled' },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'A conflicting appointment already exists at this time',
      });
    }

    const appointment = await Appointment.create({
      title,
      date,
      notes,
      status: 'pending',
      client: req.user._id,
      professional: professionalId,
    });

    if (appointment) {
      res.status(201).json(appointment);
    } else {
      res.status(400).json({ message: 'Invalid appointment data' });
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for logged in user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let appointments;

    // If user is client, get only their appointments
    if (req.user.role === 'client') {
      appointments = await Appointment.find({ client: req.user._id })
        .populate(['professional', 'client'])
        .sort({ date: 1 });
    }
    // If user is professional, get appointments where they're the professional
    else if (req.user.role === 'professional') {
      appointments = await Appointment.find({ professional: req.user._id })
        .populate(['client', 'professional'])
        .sort({ date: 1 });
    }
    // If user is admin, get all appointments
    else if (req.user.role === 'admin') {
      appointments = await Appointment.find({})
        .populate('client', 'name')
        .populate('professional', 'name')
        .sort({ date: 1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email')
      .populate('professional', 'name email');

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.role !== 'admin' &&
      appointment.client._id.toString() !== req.user._id.toString() &&
      appointment.professional._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only professionals assigned to the appointment can update status
    if (
      req.user.role === 'professional' &&
      appointment.professional.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this appointment status' });
    }

    // Prevent clients from updating status
    if (req.user.role === 'client') {
      return res
        .status(403)
        .json({ message: 'Clients cannot update appointment status' });
    }

    // Only allow specific status values
    if (!['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { title, date, notes, professionalId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow clients to update their own appointments
    if (
      req.user.role === 'client' &&
      appointment.client.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this appointment' });
    }

    // Prevent professionals from updating appointments
    if (req.user.role === 'professional') {
      return res
        .status(403)
        .json({ message: 'Professionals cannot update appointments' });
    }

    // Don't allow updates if appointment is completed or canceled
    if (
      appointment.status === 'completed' ||
      appointment.status === 'canceled'
    ) {
      return res
        .status(400)
        .json({ message: 'Cannot modify completed or canceled appointments' });
    }

    // If changing date or professional, check for conflicts
    if (
      date &&
      (new Date(date).getTime() !== new Date(appointment.date).getTime() ||
        (professionalId &&
          professionalId !== appointment.professional.toString()))
    ) {
      const appointmentDate = new Date(date);
      const professional = professionalId || appointment.professional;

      // Check for existing appointments at the same time with the same professional
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id }, // Exclude current appointment
        professional,
        date: {
          $gte: new Date(
            appointmentDate.setMinutes(appointmentDate.getMinutes() - 1)
          ),
          $lte: new Date(
            appointmentDate.setMinutes(appointmentDate.getMinutes() + 2)
          ),
        },
        status: { $ne: 'canceled' },
      });

      if (existingAppointment) {
        return res.status(400).json({
          message: 'A conflicting appointment already exists at this time',
        });
      }
    }

    // Update the appointment fields
    appointment.title = title || appointment.title;
    if (date) appointment.date = date;
    appointment.notes = notes !== undefined ? notes : appointment.notes;
    if (professionalId) appointment.professional = professionalId;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow clients to cancel their own appointments
    if (
      req.user.role === 'client' &&
      appointment.client.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this appointment' });
    }

    // Prevent professionals from canceling appointments
    if (req.user.role === 'professional') {
      return res
        .status(403)
        .json({ message: 'Professionals cannot cancel appointments' });
    }

    // Don't allow cancellation if appointment is completed
    if (appointment.status === 'completed') {
      return res
        .status(400)
        .json({ message: 'Cannot cancel completed appointments' });
    }

    appointment.status = 'canceled';
    await appointment.save();
    res.json({ message: 'Appointment canceled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  cancelAppointment,
};
