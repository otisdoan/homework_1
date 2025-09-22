# E-Commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, Prisma, and PostgreSQL for selling clothing products.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete products
- **Modern UI**: Clean and responsive design with Tailwind CSS
- **Type Safety**: Built with TypeScript for better development experience
- **Database Integration**: PostgreSQL with Prisma ORM
- **Form Validation**: Client and server-side validation with Zod
- **Image Support**: Optional product images via URL

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod with React Hook Form
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd e-commerce
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Update the `DATABASE_URL` in `.env.local` with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
```

5. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Project Structure

```
├── app/
│   ├── api/products/          # API routes
│   ├── products/              # Product pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── forms/                # Form components
│   └── ui/                   # UI components
├── lib/
│   └── db.ts                 # Database client
├── prisma/
│   └── schema.prisma         # Database schema
├── types/
│   └── product.ts            # TypeScript types
└── public/                   # Static assets
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Deploy!

### Database Setup

For production, you can use:

- **Railway**: Free PostgreSQL hosting
- **Render**: Free PostgreSQL hosting
- **Supabase**: Free PostgreSQL hosting
- **Neon**: Free PostgreSQL hosting

## Features Implemented

✅ **Required Features**

- Product model with name, description, price, and optional image
- Full CRUD API endpoints
- Homepage with product listing
- Product detail page
- Create/Update product form
- Delete product functionality
- Navigation menu

✅ **Optional Features**

- Form validation
- Responsive design
- Error handling
- Loading states
- Professional folder structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
