
echo "Starting IMF Gadget API setup..."

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push

echo "Starting the server..."
npm start
