/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/cognitive-complexity */
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { layoutPrivateStyle } from "../../../styles/layout/private-routes";
import { AdminMenuProps } from "../../../types/admin-menu";

import { UserInfoCard } from "./user-info-card";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import ManageButton from "./manage-page-button";

interface SideMenuItem {
  menuId: number;
  name: string;
  link: string;
  iconName?: string;
  collapseList: SideMenuItem[];
}

export function SideMenuAdmin({
  adminMenu,
  setAdminMenu,
  activeMenu,
  setActiveMenu,
  isSmall,
}: AdminMenuProps) {
  const Navigate = useNavigate();

  const [openCollapse, setOpenCollapse] = useState<string[]>([]);
  const smallMenu = useMediaQuery("(min-width: 600px)");
  const [modulOpen, setModulOpen] = useState(adminMenu);
  const [linkLists, setLinkLists] = useState<SideMenuItem[]>([]);

  useEffect(() => {
    if (
      window.location.pathname === "/manage-presets/define-preset" ||
      window.location.pathname === "/dashboard/editor"
    ) {
      setModulOpen(true);
      setAdminMenu?.(true);
    }
    setActiveMenu?.(window.location.pathname);
  }, [window.location.pathname]);

  const sideMenuModel = {
    initial1: {
      height: "100%",
      width: "240px",
    },
    initial2: {
      height: "100%",
      width: "0px",
    },
    animate1: { width: adminMenu ? "0px" : "240px", zIndex: 2 },
    animate2: { width: adminMenu ? "240px" : "0px" },
  };

  const variantSideMenu = isSmall
    ? {
        initial: sideMenuModel.initial1,
        animate: sideMenuModel.animate1,
      }
    : !modulOpen
    ? {
        initial: sideMenuModel.initial2,
        animate: sideMenuModel.animate2,
      }
    : {
        initial: sideMenuModel.initial1,
        animate: sideMenuModel.animate1,
      };

  const cardModel = {
    initial1: {
      width: "220px",
      height: "140px",
      margin: "10px 10px 20px 10px",
      overflow: "hidden",
    },
    initial2: {
      width: "40px",
      height: "140px",
      margin: "10px 6px 20px 6px",
      overflow: "hidden",
    },
    animate1: {
      width: adminMenu ? "40px" : "220px",
      margin: adminMenu ? "10px 6px 20px 6px" : "10px 10px 20px 10px",
    },
    animate2: {
      width: adminMenu ? "220px" : "40px",
      margin: adminMenu ? "10px 10px 20px 10px" : "10px 6px 20px 6px",
    },
  };

  const cards = isSmall
    ? {
        initial: cardModel.initial1,
        animate: cardModel.animate1,
      }
    : !modulOpen
    ? {
        initial: cardModel.initial2,
        animate: cardModel.animate2,
      }
    : {
        initial: cardModel.initial1,
        animate: cardModel.animate1,
      };

  const sideMenuTitleModul = isSmall
    ? adminMenu
      ? { display: "none" }
      : layoutPrivateStyle.sideMenuTitle
    : modulOpen
    ? !adminMenu
      ? layoutPrivateStyle.sideMenuTitle
      : { display: "none" }
    : adminMenu
    ? layoutPrivateStyle.sideMenuTitle
    : { display: "none" };

  const sideMenuIconCollapseModul = isSmall
    ? adminMenu
      ? { display: "none" }
      : layoutPrivateStyle.sideMenuIconCollapse
    : modulOpen
    ? !adminMenu
      ? layoutPrivateStyle.sideMenuIconCollapse
      : { display: "none" }
    : adminMenu
    ? layoutPrivateStyle.sideMenuIconCollapse
    : { display: "none" };

  const sideMenuIconButtonModul = isSmall
    ? adminMenu
      ? layoutPrivateStyle.sideMenuPrivateIconButton
      : layoutPrivateStyle.sideMenuPrivateIconButtonActive
    : modulOpen
    ? !adminMenu
      ? layoutPrivateStyle.sideMenuPrivateIconButtonActive
      : layoutPrivateStyle.sideMenuPrivateIconButton
    : adminMenu
    ? layoutPrivateStyle.sideMenuPrivateIconButtonActive
    : layoutPrivateStyle.sideMenuPrivateIconButton;

  const handleOpen = () => {
    if (isSmall) setModulOpen(!modulOpen);
    setAdminMenu?.(!adminMenu);
  };

  const handleClick = (link) => {
    setActiveMenu?.(link);
    Navigate(link);
  };

  const handleCollapse = (e) => {
    if (openCollapse?.find((collapse) => collapse === e))
      setOpenCollapse?.(openCollapse?.filter((collapse) => collapse !== e));
    else setOpenCollapse((prev) => [...prev, e]);
  };

  const findCollapse = (e) => {
    if (openCollapse?.find((collapse) => collapse === e)) return true;
    return false;
  };

  const getSideMenu = async () => {
    const sideMenuItems = await apiClient.get(ApiService.getSideMenu);
    setLinkLists(sideMenuItems.data.listSideMenu);
  };

  useEffect(() => {
    getSideMenu();
  }, []);

  return (
    <motion.div
      key="animate-sidemenu"
      initial={variantSideMenu.initial}
      animate={variantSideMenu.animate}
      style={{ position: smallMenu ? "relative" : "absolute" }}
    >
      {/* <Box sx={layoutPrivateStyle.sideMenuPaperBox}> */}
      <Box
        sx={{
          width: isSmall ? "240px" : "0px",
          height: "calc(100vh - 55px)",
          overflow: "hidden",
          background: "#0097DA",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          transition: "width 0.2s ease-in-out",
        }}
      >
        {/* <motion.div key="animate-userinfocard" initial={cards.initial} animate={cards.animate}>
          <UserInfoCard adminMenu={adminMenu} modulOpen={modulOpen} />
        </motion.div> */}
        <Box
          sx={{
            height: "1px",
            background: "#008DC7",
            width: "100%",
            marginBottom: "16px",
          }}
        />
        <Box
          sx={{
            height: "136px",
            margin: "10px",
            display: isSmall ? "inherit" : "none",
          }}
        >
          <UserInfoCard />
        </Box>
        <ManageButton />
        <List
          sx={{
            width: "100%",
            padding: "0",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(170, 170, 170, 0.8)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#aaa",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "initial",
              width: "15px",
            },
          }}
        >
          {linkLists.map((list) => (
            <Stack
              key={list.name}
              sx={{ display: isSmall ? "inherit" : "none" }}
            >
              <ListItemButton
                key={list.name}
                sx={
                  activeMenu?.includes(`${list.link}`) && list.link !== "/"
                    ? layoutPrivateStyle.sideMenuLinkActive
                    : findCollapse(list.name)
                    ? layoutPrivateStyle.sideMenuLinkCollapse
                    : layoutPrivateStyle.sideMenuLink
                }
                onClick={
                  list.collapseList.length === 0
                    ? () => handleClick(list.link)
                    : () => handleCollapse(list.name)
                }
              >
                <Stack
                  direction="row"
                  gap="4px"
                  alignItems="center"
                  sx={{ display: isSmall ? "inherit" : "none" }}
                >
                  <span className="material-icons" style={{ fontSize: "16px" }}>
                    {list.iconName}
                  </span>
                  <Typography sx={sideMenuTitleModul}>{list.name}</Typography>
                </Stack>
                {findCollapse(list.name) ? (
                  <ExpandMore sx={sideMenuIconCollapseModul} />
                ) : (
                  list.collapseList.length > 0 && (
                    <KeyboardArrowLeftIcon sx={sideMenuIconCollapseModul} />
                  )
                )}
              </ListItemButton>
              {findCollapse(list.name) && (
                <Stack
                  sx={{
                    paddingLeft: "16px",
                    display: isSmall ? "inherit" : "none",
                  }}
                >
                  {list.collapseList.map((subList) => (
                    <ListItemButton
                      key={subList.name}
                      sx={
                        activeMenu?.includes(`${subList.link}`)
                          ? layoutPrivateStyle.sideMenuLinkActive
                          : layoutPrivateStyle.sideMenuLink
                      }
                      onClick={() => handleClick(subList.link)}
                    >
                      <Stack direction="row" gap="4px" alignItems="center">
                        {/* {renderIcon(subList.iconName)} */}
                        <Typography sx={sideMenuTitleModul}>
                          {subList.name}
                        </Typography>
                      </Stack>
                    </ListItemButton>
                  ))}
                </Stack>
              )}
            </Stack>
          ))}
        </List>
      </Box>
    </motion.div>
  );
}
