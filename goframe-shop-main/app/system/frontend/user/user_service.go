package user

import (
	"github.com/gogf/gf/net/ghttp"
	"github.com/gogf/gf/util/gconv"
	"shop/app/dao"
	"shop/app/middleware"
)

var service = new(userService)

type userService struct {
}

func (s *userService) Info(r *ghttp.Request) (res UserInfoRes, err error) {
	userid := gconv.Int(r.GetCtxVar(middleware.CtxAccountId))
	err = dao.UserInfo.WherePri(userid).Scan(&res)
	if err != nil {
		return UserInfoRes{}, err
	}
	return
}
