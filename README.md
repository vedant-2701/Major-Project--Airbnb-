# Wanderlust - A Full-Stack Airbnb Clone

Wanderlust is a full-stack web application that replicates the core functionalities of Airbnb. It allows users to browse, list, and book accommodations, as well as leave reviews. This project is built using the MEN stack (MongoDB, Express.js, Node.js) and EJS for server-side rendering.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vedant-2701/Major-Project--Airbnb-.git
   ```
2. Navigate to the project directory:

   ```bash
   cd wanderlust
   ```
3. Install the dependencies:

   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following environment variables:

   ```
   ATLAS_DB_URL=<your_mongodb_atlas_connection_string>
   SECRET=<your_session_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

## Usage

1. Start the development server:

   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** Passport.js (with passport-local and passport-local-mongoose)
*   **Templating:** EJS (with ejs-mate)
*   **File Uploads:** Multer (with Cloudinary for storage)
*   **Mapping:** Mapbox
*   **Other:** connect-flash, connect-mongo, method-override, joi

## Features

*   **User Authentication:** Users can sign up, log in, and log out.
*   **Listings:**
    *   Browse all listings.
    *   View details of a specific listing.
    *   Create new listings with image uploads.
    *   Edit and delete their own listings.
*   **Reviews:**
    *   Users can leave reviews for listings.
    *   Users can delete their own reviews.
*   **Authorization:** Users can only edit or delete their own listings and reviews.
*   **Flash Messages:** Flash messages are used to provide feedback to the user.
*   **Interactive Maps:** Maps are displayed for each listing using Mapbox.
