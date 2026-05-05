package com.puericulture.config.errormanager;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ErrorResponse {
    String message;
}
