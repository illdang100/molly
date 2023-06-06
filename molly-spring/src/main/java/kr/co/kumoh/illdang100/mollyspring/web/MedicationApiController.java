package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.service.MedicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationRespDto.*;
@Slf4j
@RestController
@RequestMapping("/api/auth/pet/medication")
@RequiredArgsConstructor
public class MedicationApiController {
    private final MedicationService medicationService;
    @PostMapping
    public ResponseEntity<?> saveMedication(@RequestBody @Valid MedicationSaveRequest request, BindingResult bindingResult) {

        Long medicationId = medicationService.saveMedication(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "복용 약 이력 저장 성공", new MedicationSaveResponse(medicationId)), HttpStatus.CREATED);
    }

    @GetMapping("{petId}")
    public ResponseEntity<?> viewMedicationList(@PathVariable @Valid Long petId) {

        List<MedicationResponse> medicationList = medicationService.viewMedicationList(petId);

        return  new ResponseEntity<>(new ResponseDto<>(1, "복용 약 이력 조회 성공", new MedicationListResponse(medicationList)), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> updateMedication(@RequestBody @Valid MedicationUpdateRequest request, BindingResult bindingResult) {

        medicationService.updateMedication(request);

        return  new ResponseEntity<>(new ResponseDto<>(1, "복용 약 이력 수정 성공", null), HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<?> deleteMedication(@RequestBody @Valid MedicationDeleteRequest request, BindingResult bindingResult) {

        medicationService.deleteMedication(request);

        return  new ResponseEntity<>(new ResponseDto<>(1, "복용 약 이력 삭제 성공", null), HttpStatus.OK);
    }
}
