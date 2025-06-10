import React, { useState } from "react";
import { Menu, MenuItem, Avatar, Divider, ListItemIcon } from "@mui/material"; //npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
import { AccountCircle, Settings, Logout, Person, PhotoCamera, Gavel } from "@mui/icons-material";
import "./profileMenu.css";

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="profile-menu-container">
      <AccountCircle
        className="profile-icon"
        onClick={handleClick}
        fontSize="large"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ className: "profile-menu" }}
      >
        <div className="profile-header">
          <Avatar
            alt="User"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFs3xGXDwyPFZ7ZwCqakei5NnEC9X57paPg&s"
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">CHUKI</span>
            <span className="profile-email">CHUCKIREAL@Gmail.com</span>
          </div>
        </div>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          Mi perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><PhotoCamera fontSize="small" /></ListItemIcon>
          Cambiar foto
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Configuración
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Gavel fontSize="small" /></ListItemIcon>
          Políticas de privacidad
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
