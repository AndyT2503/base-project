interface Menu {
  title: string;
  link?: string;
  requireRole?: string[];
  icon: string;
  children?: SubMenu[];
}

interface SubMenu {
  title: string;
  link: string;
  requireRole?: string[];
}

export const MENU_DATA: Menu[] = [];
