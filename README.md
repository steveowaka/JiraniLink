JiraniLink

"Jirani" is Swahili for neighbour, and that's the idea: a place where neighbours share the plumbers, tutors, babysitters and mechanics they actually trust, so the next person doesn't have to start from scratch.

Live site: https://jirani-link.vercel.app/
Figma design: https://www.figma.com/design/8WG1cxKUUvRQxV22oL7CdL/JiraniLink---Desktop-Design?node-id=0-1&p=f&t=QK2fEje1TPhcsvcd-0
Project board: https://github.com/users/steveowaka/projects/6/views/6

What you can do:

1.Sign up and log in with email and password, or with Google
2.Browse every provider, search by name, location or category, and filter by category
3.Open a provider to see their contact details, their description and what reviewers said
4.Add a provider (only when you're logged in), with a first review attached
5.Search for a place while adding a provider, so the exact spot can be linked on OpenStreetMap
6.Log out, and the header changes depending on whether you're signed in

Built with:

1.React and Vite
2.React Router
3.Tailwind CSS
4.Firebase Authentication and Cloud Firestore
5.OpenStreetMap Nominatim for place search
6.Vitest and React Testing Library for tests
7.GitHub Actions for CI, Vercel for hosting

git clone https://github.com/steveowaka/Jirani-link.git
cd Jirani-link
npm install


Command	What it does:

npm run dev-Starts the dev server
npm run build-Makes a production build in dist/
npm run lint-Runs ESLint
npm test-Runs the tests once
npm run coverage-Runs the tests and shows a coverage report

Tests and deployment

Tests sit next to the code they check, in files ending in .test.jsx. Firebase and the Nominatim API are mocked, so running them never touches a real service.

Every pull request and every push to main runs a GitHub Actions workflow (.github/workflows/ci.yml) that installs the dependencies, lints, runs the tests and builds the app. The Firebase values are stored as repository secrets, so nothing sensitive is committed.

The app is hosted on Vercel. vercel.json sends every path to index.html, otherwise refreshing on a page like /providers would give a 404. If you deploy your own copy, add the same six VITE_FIREBASE_... variables in Vercel, and add your domain in Firebase under Authentication, Settings, Authorized domains, or Google sign-in won't work.