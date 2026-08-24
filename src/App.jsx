import {
  Routes,
  Route
} from "react-router-dom";
import Users from "./pages/admin/Users";
import Home from "./pages/Home";

import MenuPage from "./pages/public/MenuPage";

import Login from "./pages/admin/Login";

import Dashboard from "./pages/admin/Dashboard";
import Restaurants from "./pages/admin/Restaurants";
import MenuManagement from "./pages/admin/MenuManagement";



import ProtectedRoute from "./routes/ProtectedRoute";


function App() {

  return (

    <Routes>

      {/* POCETNA */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* JAVNI MENI */}

      <Route
        path="/menu/:restaurantId"
        element={<MenuPage />}
      />


      {/* LOGIN */}

      <Route
        path="/admin"
        element={<Login />}
      />



{/* ADMIN DASHBOARD */}

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute
      allowedRoles={[
        "superadmin",
        "admin",
        "owner"
      ]}
    >
      <Dashboard />
    </ProtectedRoute>
  }
/>


{/* RESTORANI */}

<Route
  path="/admin/restaurants"
  element={
    <ProtectedRoute
      allowedRoles={[
        "owner",
        "superadmin"
      ]}
    >
      <Restaurants />
    </ProtectedRoute>
  }
/>


{/* UPRAVLJANJE MENIJEM */}

<Route
  path="/admin/menu/:restaurantId"
  element={
    <ProtectedRoute
      allowedRoles={[
        "owner",
        "superadmin"
      ]}
    >
      <MenuManagement />
    </ProtectedRoute>
  }
/>

{/* KORISNICI - SAMO SUPERADMIN */}

<Route
  path="/admin/users"
  element={
    <ProtectedRoute
      allowedRoles={[
        "superadmin"
      ]}
    >
      <Users />
    </ProtectedRoute>
  }
/>

     

    </Routes>

  );
}


export default App;