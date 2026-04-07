import { config } from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
    process.env

// token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQyYTA5NjNiNGI4MTNlNjBiYTc4NzkiLCJpYXQiOjE3NzU0MTEzNTAsImV4cCI6MTc3NTQ5Nzc1MH0.mcoQaIN_qOKJMJ-Xbcl_vQ1rJNoV5UQtHk0YAzbcyy4"

// _id: "69d2a0963b4b813e60ba7879"
