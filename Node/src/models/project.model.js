const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      required: [true, 'La catégorie est obligatoire'],
    },
    technologies: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    demo: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

module.exports = mongoose.model('Project', projectSchema);
