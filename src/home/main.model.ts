/**
 *  main data
 */
export class MainData
{
    // user data
    userData: UserData;

    // 菜单数据
    menuData: Array<MenuData>;
}

/**
 * user data
 */
export class UserData
{
    // user name
    userName: string;
    // avatar
    userAvatar: string;
    // mobile phone
    mobilePhone: string;
    // email
    email: string;
    // position
    positions: string;
}

/**
 * menu data
 */
export class MenuData
{
    // id
    id: string;
    // parent id
    parentId: string;
    // name
    name: string;
    // key word
    keyWord: string;
    // icon
    icon: string;
    // expend
    isExpend?: boolean;
    // url
    url?: string;
    // children
    children?: Array<MenuData>;
}
