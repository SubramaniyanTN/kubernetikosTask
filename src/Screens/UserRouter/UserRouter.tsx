import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack } from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";
import supabase from "../../utils/supabaseConfig";
import { toast } from "react-toastify";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const linkData = [
  { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
  { icon: IconSettings, label: "Settings", path: "/settings" },
];

const UserRouter = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleLogOut = async () => {
    const id = toast.loading("Logging out");
    await supabase.auth.signOut();
    toast.update(id, {
      type: "success",
      render: "Logout Successfully",
      isLoading: false,
      progress: 0,
      autoClose: 3000,
    });
    navigate("/");
  };

  const links = linkData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        handleNavigation(link.path);
      }}
    />
  ));

  return (
    <div className={classes.container}>
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Center>
            <div>{linkData[active].label}</div>
          </Center>
        </div>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <div className={classes.footer}>
          <Stack justify="center" gap={0}>
            <NavbarLink
              onClick={handleLogOut}
              icon={IconLogout}
              label="Logout"
            />
          </Stack>
        </div>
      </nav>

      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserRouter;
