package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.service.VaccinationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationRespDto.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/pet/vaccination")
@RequiredArgsConstructor
public class VaccinationApiController {

    private final VaccinationService  vaccinationService;

    @PostMapping
    public ResponseEntity<?> saveVaccination(@RequestBody @Valid VaccinationSaveRequest request) {

        Long VaccinationId = vaccinationService.saveVaccination(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "예방접종 기록 저장 성공", new VaccinationSaveResponse(VaccinationId)), HttpStatus.CREATED);
    }

    @GetMapping("{petId}")
    public ResponseEntity<?> viewVaccinationList(@PathVariable @NotNull Long petId) {

        List<VaccinationResponse> VaccinationList = vaccinationService.viewVaccinationList(petId);

        return new ResponseEntity<>(new ResponseDto<>(1, "예방접종 기록 조회 성공", new VaccinationListResponse(VaccinationList)), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> updateVaccination(@RequestBody @Valid VaccinationUpdateRequest request) {

        vaccinationService.updateVaccination(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "예방접종 기록 수정 성공", null), HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<?> deleteVaccination(@RequestBody @Valid VaccinationDeleteRequest request) {

        vaccinationService.deleteVaccination(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "예방접종 기록 삭제 성공", null), HttpStatus.OK);
    }
}
