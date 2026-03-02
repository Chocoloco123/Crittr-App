import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(_request: NextRequest) {
  try {
    console.log('DELETE /api/users/me - Starting request')
    
    // Get the current session
    const session = await getServerSession(authOptions)
    
    console.log('DELETE /api/users/me - Session:', session)
    
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json(
        { error: 'Unauthorized - must be logged in' },
        { status: 401 }
      )
    }

    // Get the user ID from the session - try different possible locations
    const userId = (session.user as { id?: string }).id || (session as { userId?: string }).userId
    console.log('User ID from session:', userId)
    
    if (!userId) {
      console.log('No user ID found in session')
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 401 }
      )
    }

    console.log('Forwarding request to backend...')
    
    // Forward the request to the backend with user identification
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/users/me`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId, // Pass user ID for backend verification
        'X-User-Email': session.user.email, // Pass email for additional verification
      },
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.log('Backend error:', error)
      return NextResponse.json(
        { error: error.detail || 'Failed to delete user' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Backend success:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}