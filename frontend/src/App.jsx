import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    </>
  );
}

export default App;
