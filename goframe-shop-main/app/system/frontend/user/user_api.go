package user

import (
	"github.com/gogf/gf/net/ghttp"
	"shop/library/response"
)

var User = UserApi{}

type UserApi struct{}

func (*UserApi) Info(r *ghttp.Request) {
	res, err := service.Info(r)
	if err != nil {
		response.FailureWithData(r, 0, err, "")
	}
	response.SuccessWithData(r, res)
}
