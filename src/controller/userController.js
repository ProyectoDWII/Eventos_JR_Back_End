const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null }).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.id, 
      deletedAt: null 
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, status } = req.body;
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId },
        deletedAt: null 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || user.name,
        email: email || user.email,
        phoneNumber: phoneNumber || user.phoneNumber,
        status: status || user.status
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['admin', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Debe ser "admin" o "client"'
      });
    }

    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.role === 'admin' && role === 'client') {
      const adminCount = await User.countDocuments({ role: 'admin', deletedAt: null });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede cambiar el rol del último administrador'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar rol',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', deletedAt: null });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar al último administrador'
        });
      }
    }

    user.deletedAt = new Date();
    user.status = 'inactive';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: {
        id: user._id,
        name: user.name,
        deletedAt: user.deletedAt
      }
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

exports.restoreUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.deletedAt) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no está eliminado'
      });
    }

    user.deletedAt = null;
    user.status = 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuario restaurado exitosamente',
      data: {
        id: user._id,
        name: user.name,
        restoredAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error al restaurar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restaurar usuario',
      error: error.message
    });
  }
};