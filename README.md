# **Memobrain**

**Memobrain** is a smart knowledge management app designed to help you store, organize, and easily access your important resources like links, tweets, document links, and YouTube videos. Using custom tags for organization, you can quickly find what you need and share your saved items via unique links. **Memobrain** helps you keep everything in one place—store, tag, and share, effortlessly.

---

## **Features**

- **Store Links**: Save links, tweets, document links, and YouTube videos in one place.
- **Tagging System**: Organize your resources using custom tags for easy categorization. [Soon]
- **Easy Access**: Quickly access your saved resources based on tags. [Soon]
- **Sharing**: Share your saved resources via a unique link with anyone.

---

## **How It Works**

1. **Create an Account**: Sign up to store your resources.
2. **Save Resources**: Add links, tweets, document links, or YouTube videos to your collection.
3. **Tag Your Resources**: Use tags to organize and make your resources easily searchable.
4. **Share with Others**: Generate a unique link to share your resources with friends or colleagues.

---

## **Tech Stack**

- **Frontend**: React, Next.js, Shadcn Ui
- **Backend**: Nextjs Server Action
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: TailwindCSS
- **Authentication**: JWT authentication with **access tokens** and **refresh tokens**.

---

## **Authentication**

Memobrain uses **JWT (JSON Web Tokens)** for secure authentication. The system follows a two-token authentication process:

- **Access Token**: A short-lived token used for authenticating API requests. It is sent with each request and expires after a specified period (e.g., 15 minutes).
- **Refresh Token**: A long-lived token used to obtain a new access token once the current access token expires. Refresh tokens are stored securely and are used to maintain a seamless login experience.

---
