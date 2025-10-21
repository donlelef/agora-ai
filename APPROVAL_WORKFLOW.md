# Post Approval Workflow

This feature allows users to share simulation results with other team members for approval before publishing.

## Features

### 1. Share Posts for Approval
After running a simulation, users can:
- Click the "Share for Approval" button on any post variant
- Enter the approver's email address
- Add optional notes for context
- Send the post for review

### 2. Review Pending Approvals
Approvers can:
- View all pending approval requests in the **Approvals** page
- See the post content with its NPS score
- Review simulation data and creator's notes
- Provide feedback (optional for approval, required for rejection)
- Approve or reject posts

### 3. Track Approval Status
- Pending approvals appear at the top of the Approvals page
- Completed approvals (approved/rejected) are shown in a separate section
- Real-time status badges indicate the current state

## User Flow

### For Post Creators:

1. **Run a Simulation**
   - Go to the home page
   - Enter your post idea and select an agora
   - Run the simulation

2. **Share the Best Variant**
   - After results appear, click "Share for Approval" on your preferred variant
   - Enter the approver's email
   - Add context notes if needed
   - Click "Send for Approval"

3. **Success Confirmation**
   - A success message confirms the post was shared
   - The approver will receive access to review

### For Approvers:

1. **Access Approvals**
   - Click "Approvals" in the navigation menu
   - View all pending approval requests

2. **Review Post Details**
   - Read the post content
   - Check the NPS score
   - Review simulation data
   - Read creator's notes

3. **Make a Decision**
   - Add optional feedback (required for rejection)
   - Click "Approve" to accept the post
   - Click "Reject" with feedback to decline

## API Endpoints

### Create Shared Post
```
POST /api/shared-posts
Body: {
  postText: string,
  nps: number,
  simulationData: object,
  notes?: string,
  approverEmail: string
}
```

### Get Approvals
```
GET /api/shared-posts?role=approver
GET /api/shared-posts?role=creator
```

### Get Specific Post
```
GET /api/shared-posts/[id]
```

### Approve Post
```
POST /api/shared-posts/[id]/approve
Body: {
  feedback?: string
}
```

### Reject Post
```
POST /api/shared-posts/[id]/reject
Body: {
  feedback: string
}
```

### Delete Shared Post
```
DELETE /api/shared-posts/[id]
```

## Database Schema

### SharedPost
- `id`: Unique identifier
- `userId`: Creator's Clerk user ID
- `postText`: The post content
- `nps`: Net Promoter Score
- `simulationData`: Full simulation results (JSON)
- `notes`: Optional context from creator
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### PostApproval
- `id`: Unique identifier
- `sharedPostId`: Reference to SharedPost
- `approverId`: Approver's identifier (email or user ID)
- `status`: "pending" | "approved" | "rejected"
- `feedback`: Optional feedback message
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Security

- All routes are protected by Clerk authentication
- Users can only approve posts explicitly shared with them
- Only creators can delete their shared posts
- Approvers cannot edit posts, only provide feedback

## Future Enhancements

Potential improvements:
- Email notifications for new approval requests
- Multi-approver workflows (require X out of Y approvals)
- Approval history and audit trail
- Direct publishing after approval
- Integration with social media APIs
- Scheduled publishing
- Approval templates for common feedback

## Notes

- Currently uses email as approver identifier
- In production, integrate with user management system to map emails to user IDs
- Consider adding webhook support for external integrations

