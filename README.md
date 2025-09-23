# My Fullstack App

This project is a fullstack application that consists of a React frontend and a Node.js backend using Express. 

## Project Structure

```
my-fullstack-app
├── frontend          # Frontend React application
│   ├── src          # Source files for React
│   ├── public       # Public assets
│   ├── package.json # Frontend dependencies and scripts
│   └── README.md    # Frontend documentation
├── backend           # Backend Node.js application
│   ├── src          # Source files for Node.js
│   ├── package.json # Backend dependencies and scripts
│   └── README.md    # Backend documentation
└── README.md        # Overall project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-fullstack-app
   ```

2. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```

3. Install dependencies for the backend:
   ```
   cd ../backend
   npm install
   ```
4. Change/Add environment files. 
   4.1 Backend needs connection strings for database.
   4.2 Front end needs path for APIs

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

The frontend will typically run on `http://localhost:3000` and the backend on `http://localhost:5000`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License.

## Information Only

You can change folder names (frontend and backend) to remove .nosync. It was added to remove syncing it with iCloud on MacOS. 

## Deployment

For deploying the code, you can explore free options. Some suggestions: 
1. Front end on Vercel (has a free tier)
2. Backend on Hostinger (VPS for low price)
3. Database on Supabase (has a free tier)

### Front-End
1. Vercel gives free hosting for front end only. Create a free account on vercel.com. Follow the prompts to create the account. 
2. Once the account is created, link your GitHub account. This will come in handy when doing the deploys. Vercel automatically detects the changes and pushes it to your Prod/Preview branch
3. Make sure you have your domains pointed as well. Vercel will give you the instructions on how to make DNS changes to your domain hosting. You'd need to create an A record in your domain hosting and a CNAME for www. Additionally, Vercel will automatically create a let's encrypt SSL for your project

### PostgreSQL
1. Supabase provides a free tier for your project. If the traffic is not heavy, free tier will be sufficient. 
2. Follow the prompts to create the account and the database. 
3. You'd have to run the DDL to create the table. Click on connect once you are done with database
4. At the time of writing this readme, Supabase Direct Connection is not IPv4 compatible. For your web project, you'd have to select the Session Pooler. Make sure your env file has the right settings

### Backend (APIs)
1. A lightweight VPS hosting from Hostinger or any hosting provider that gives you root access to the server will do. 
2. For easy installation, you can install an open source Panel like easyPanel. This is mostly point and click without the need for logging into the server
3. Once you deploy your code, make sure your API's are listening to the correct port and the path is right in the env file of your frontend.
4. Make sure you in your domain hosting you have an A record with api created, pointing to the server IP address of your hosting. 

To debug your deployment a step-by-step approach will be 
1. Deploy Frontend (API's pointing to local server and local db) and test
2. Deploy Supbase (backend pointing to Supabase) and test
3. Deploy Backend and test

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Features to be developed (and in progress) include:
1. Verification for login
2. Captcha before voting for public vote
3. Admin Panel
4. Report button on polls. Report flags the poll. COnsider a separate table that keeps track of flagging
5. Forums to discuss Polls (beta version is coded)
6. SEO (can be made better)
7. Delete account
8. Leaderboard 
9. Analytics (Polls created, Impact)
9.1 Analytics for real time update during sharing
10. Homepage improvements
11. Iframe for including into websites
12. Sharing using QR Code or a number

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.

