import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Jobs from './Jobs'
import JobItemDetails from './JobItemDetails'
import ProtectedRoute from './ProtectedRoute'
import NotFound from './NotFound'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute path="/jobs/:id" component={JobItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
