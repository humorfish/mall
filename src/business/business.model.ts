/**
 *  todo
 */

 export class TodoData
 {
     id: number;
     title: number;
     submitUser: string;
     createData: string;
 }

 /**
  * todo object
  */

  export class TodoObjectData
  {
      total: number;
      totoList: Array<TodoData>;
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

export class NeedReadObjectData
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

export class NoticeObjectData
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
