package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/calendar")
@RequiredArgsConstructor
public class AnnualCalendarApiController {

    private final PetService petService;

    @GetMapping("{petId}")
    public ResponseEntity<?> viewAnnualCalendarSchedule(@PathVariable Long petId) {

        PetCalendarResponse response = petService.viewAnnualCalendarSchedule(petId);

        return new ResponseEntity<>(new ResponseDto<>(1, "", response), HttpStatus.OK);
    }
}
