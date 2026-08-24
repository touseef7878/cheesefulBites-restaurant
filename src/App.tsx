/** Cheeseful Bites visual system: responsive Cheesy Maximalism routes and motion-led ordering pages. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { MotionConfig } from "framer-motion";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import Favorites from "./pages/Favorites";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/menu"} component={Menu} />
      <Route path={"/product/:id"} component={Product} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <SupabaseAuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <MotionConfig reducedMotion="user">
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </MotionConfig>
            </CartProvider>
          </FavoritesProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
