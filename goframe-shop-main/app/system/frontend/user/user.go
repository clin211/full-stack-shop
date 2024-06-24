package user

import "github.com/gogf/gf/util/gmeta"

type UserInfo struct {
	gmeta.Meta `orm:"table:user_info"`
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Avatar     string `json:"avatar"`
	Sex        int    `json:"sex"`
	Status     int    `json:"status"`
	Sign       string `json:"sign"`
	TimeCommon
}

type UserInfoRes struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Sex    int    `json:"sex"`
	Status int    `json:"status"`
	Sign   string `json:"sign"`
}

type TimeCommon struct {
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
