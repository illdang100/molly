package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto.SurgerySaveRequest;
import kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryRespDto.SurgerySaveResponse;
import kr.co.kumoh.illdang100.mollyspring.service.SurgeryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryRespDto.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/pet/surgery")
@RequiredArgsConstructor
public class SurgeryApiController {

    private final SurgeryService surgeryService;
    @PostMapping
    public ResponseEntity<?> saveSurgery(@RequestBody @Valid SurgerySaveRequest request, BindingResult bindingResult) {

        Long surgeryId = surgeryService.saveSurgery(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "수술 이력 등록 성공", new SurgerySaveResponse(surgeryId)), HttpStatus.CREATED);
    }

    @GetMapping("{petId}")
    public ResponseEntity<?> viewSurgeryList(@PathVariable @NotNull Long petId) {

        List<SurgeryResponse> surgeryList = surgeryService.viewSurgeryList(petId);

        return new ResponseEntity<>(new ResponseDto<>(1, "수술 이력 조회 성공", new SurgeryListResponse(surgeryList)), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> updateSurgery(@RequestBody @Valid SurgeryUpdateRequest request, BindingResult bindingResult) {

        surgeryService.updateSurgery(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "수술 이력 수정 성공", null), HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<?> deleteSurgery(@RequestBody @Valid SurgeryDeleteRequest request, BindingResult bindingResult) {

        surgeryService.deleteSurgery(request);

        return new ResponseEntity<>(new ResponseDto<>(1, "수술 이력 삭제 성공", null), HttpStatus.OK);
    }
}
