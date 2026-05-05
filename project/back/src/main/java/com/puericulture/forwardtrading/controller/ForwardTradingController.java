package com.puericulture.forwardtrading.controller;

import com.puericulture.config.errormanager.exception.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/forward-trading")
public class ForwardTradingController {
    @GetMapping()
    public Object testMapping(@RequestParam Integer errorCode){
        switch (errorCode){
            case 500: throw new InternalServorError("Une erreur est survenue");
            case 400: throw new BadRequestException("Bad Request");
            case 401: throw new UnauthorizedException("Unauthorized");
            case 404: throw new NotFoundException("Not Found");
            case 501: throw new NotImplementedException("Not implemented");
            default: return new Object();
        }
    }
}
