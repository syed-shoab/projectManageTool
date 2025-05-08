import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectflow')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ProjectFlow API' })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  })
})