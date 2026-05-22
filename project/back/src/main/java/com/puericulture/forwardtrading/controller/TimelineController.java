package com.puericulture.forwardtrading.controller;

import com.puericulture.config.errormanager.ErrorResponse;
import com.puericulture.forwardtrading.dto.TimelinePeriodDto;
import com.puericulture.forwardtrading.service.TimelineService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "Timeline (Forward Trading)",
        description = "Endpoints allowing users to interact with timelines.")
public class TimelineController extends ForwardTradingController {

    private final TimelineService timelineService;

    @Operation(
            summary = "Get a timeline by id",
            description = "Allows a user to read an timeline with all his periods")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Timeline exist and success.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        array =
                                                @ArraySchema(
                                                        schema =
                                                                @Schema(
                                                                        implementation =
                                                                                TimelinePeriodDto
                                                                                        .class)),
                                        examples = {
                                            @ExampleObject(
                                                    name = "Timeline Example",
                                                    summary =
                                                            "Timeline with tow periods and total four articles",
                                                    value =
                                                            "[\n"
                                                                    + "  {\n"
                                                                    + "    \"id\": \"1\",\n"
                                                                    + "    \"type\": \"T1\",\n"
                                                                    + "    \"label\": \"0-3Months\",\n"
                                                                    + "    \"products\": [\n"
                                                                    + "      {\n"
                                                                    + "        \"id\": 0,\n"
                                                                    + "        \"name\": \"Lord Voldemort Cosplay\",\n"
                                                                    + "        \"price\": 100000,\n"
                                                                    + "        \"tag\": \"Essential\"\n"
                                                                    + "      }\n"
                                                                    + "    ]\n"
                                                                    + "  }\n, "
                                                                    + "\n"
                                                                    + "  {\n"
                                                                    + "    \"id\": \"2\",\n"
                                                                    + "    \"type\": \"T2\",\n"
                                                                    + "    \"label\": \"6-9Months\",\n"
                                                                    + "    \"products\": [\n"
                                                                    + "      {\n"
                                                                    + "        \"id\": 10,\n"
                                                                    + "        \"name\": \"Red Dead Redemption 2\",\n"
                                                                    + "        \"price\": 70,\n"
                                                                    + "        \"tag\": \"Game\"\n"
                                                                    + "      }\n"
                                                                    + "    ]\n"
                                                                    + "  }\n"
                                                                    + "]")
                                        })),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request param.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "403",
                        description = "Timeline does not depends on the current user.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Timeline not found.",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorResponse.class)))
            })
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/timelines/{timelineId}")
    public ResponseEntity<List<TimelinePeriodDto>> getTimeline(@PathVariable Long timelineId) {
        return ResponseEntity.ok(timelineService.getTimeline(timelineId));
    }
}
