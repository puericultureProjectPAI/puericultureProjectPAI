package com.puericulture.forwardtrading.controller;

import com.puericulture.config.errormanager.ErrorResponse;
import com.puericulture.forwardtrading.dto.children.ChildDto;
import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.service.ChildrenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "Children (Forward Trading)",
        description = "Endpoints allowing users to manage their children profiles.")
public class ChildrenController extends ForwardTradingController {
    private final ChildrenService childrenService;

    @Operation(
            summary = "Create a child",
            description =
                    "Allows a user to register a child with a name, date of birth and gender.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "201", description = "Child successfully created."),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request body.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "403",
                        description = "Access denied.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("children")
    public void createChildren(
            @RequestBody CreateChildren children, @AuthenticationPrincipal String userId) {
        childrenService.createChildren(children, userId);
    }

    @Operation(
            summary = "Get all children of the current user",
            description =
                    "Returns the list of all children associated with the authenticated user.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Children list retrieved successfully.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        array =
                                                @ArraySchema(
                                                        schema =
                                                                @Schema(
                                                                        implementation =
                                                                                ChildDto.class)),
                                        examples = {
                                            @ExampleObject(
                                                    name = "Children Example",
                                                    summary = "List of two children",
                                                    value =
                                                            "[\n"
                                                                    + "  {\n"
                                                                    + "    \"id\": 1,\n"
                                                                    + "    \"firstName\": \"Cassian\",\n"
                                                                    + "    \"age\": 2,\n"
                                                                    + "    \"birthDate\": \"2024-03-15\",\n"
                                                                    + "    \"timelineId\": 10\n"
                                                                    + "  },\n"
                                                                    + "  {\n"
                                                                    + "    \"id\": 2,\n"
                                                                    + "    \"firstName\": \"Luna\",\n"
                                                                    + "    \"age\": 0,\n"
                                                                    + "    \"birthDate\": \"2026-01-20\",\n"
                                                                    + "    \"timelineId\": 11\n"
                                                                    + "  }\n"
                                                                    + "]")
                                        })),
                @ApiResponse(
                        responseCode = "403",
                        description = "Access denied.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("children")
    public List<ChildDto> getChildrens(@AuthenticationPrincipal String userId) {
        return childrenService.getChildren(userId);
    }
}
