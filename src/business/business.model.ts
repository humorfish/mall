/**
 *  todo
 */

 export class TodoData
 {
     id: number;
     title: string;
     submitUser: string;
     createDate: string;
 }

 /**
  * todo object
  */

  export class TodoObjData
  {
      total: number;
      todoList: Array<TodoData>;
  }

/**
 *  todo read
 */

export class NeedReadData
{
    id: number;
    title: string;
    type: string;
    createDate: string;
}

/**
 *  todo read object
 */

export class NeedReadObjData
{
    total: number;
    needReadList: Array<NeedReadData>;
}

/**
 *  notice
 */

 export class NoticeData
 {
    id: number;
    title: string;
    createDate: string;
 }

 /**
  *  notice object
 */

export class NoticeObjData
{
    total: number;
    noticeList: Array<NoticeData>;
}

/**
 *  common data
 */

export class CommonFuncData
{
    id: string;
    name: string;
    icon: string;
    url?: string;
}
