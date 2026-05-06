package com.puericulture.forwardtrading.controller;

import com.puericulture.config.errormanager.exception.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/forward-trading")
public class ForwardTradingController {
    @GetMapping()
    public Object testMapping(@RequestParam Integer errorCode){
        switch (errorCode){
            case 500: throw new InternalServorError();
            case 400: throw new BadRequestException();
            case 401: throw new UnauthorizedException();
            case 403: throw new ForbiddenException();
            case 404: throw new NotFoundException();
            case 501: throw new NotImplementedException();
            default: return new Object();
        }
    }
}
