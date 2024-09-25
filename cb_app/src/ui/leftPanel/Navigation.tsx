import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PeopleIcon from '@mui/icons-material/People';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import TtyIcon from '@mui/icons-material/Tty';
import { Link, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
function Navigation() {
  const links = [
    { name: 'Dashboard', link: '/', icon: <SpaceDashboardIcon /> },
    { name: 'Flowcharts', link: '/flowcharts', icon: <ShapeLineIcon /> },
    { name: 'Bots', link: '/bots', icon: <SmartToyIcon /> },
    // { name: 'Knowledgebase', link: '/knowledgebase', icon: <TipsAndUpdatesIcon /> },
    { name: 'Leads Collections', link: '/leads-collections', icon: <PeopleIcon /> },
    { name: 'Sessions', link: '/sessions', icon: <TtyIcon /> },
  ];

  return (
    <List component="nav">
      {links.map((link, i) => (
        <Link to={link.link} key={i} component={RouterLink} underline="none" color="textSecondary">
          <ListItemButton>
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.name} />
          </ListItemButton>
        </Link>
      ))}
    </List>
  );
}
export default Navigation;
