import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  {
    icon: IconGauge,
    label: "Dashboard",
    path: "/user/",
  },
  {
    icon: IconSettings,
    label: "Settings",
    path: "/user/settings",
  },
];

const UserRouter = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  // Update active index based on location.pathname
  useEffect(() => {
    const activeIndex = linkData.findIndex(
      (link) => link.path === location.pathname
    );
    setActive(activeIndex >= 0 ? activeIndex : 0);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const checkVerifiedUser = async () => {
    const response = await supabase.auth.getUser();
    if (!response.data.user) {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    checkVerifiedUser();
  }, [location.pathname]);
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
    navigate("/", { replace: true });
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
          <Stack justify="center" align="center" gap={10}>
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
