package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.PetDetailResponse;
import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/pet")
@RequiredArgsConstructor
public class PetApiController {

    private final PetService petService;
    @PostMapping
    public ResponseEntity<?> registerPet(@ModelAttribute @Valid PetSaveRequest petSaveRequest,
                                         BindingResult bindingResult,
                                         @AuthenticationPrincipal PrincipalDetails principalDetails) {

        Long petId = petService.registerPet(petSaveRequest, principalDetails.getAccount());

        return new ResponseEntity<>(new ResponseDto(1, "반려동물 등록을 성공했습니다.", new PetSaveResponse(petId)), HttpStatus.CREATED);
    }
    @GetMapping("{petId}")
    public ResponseEntity<?> viewDetails(@PathVariable @NotNull Long petId) {

        PetDetailResponse petDetailResponse = petService.viewDetails(petId);

        return new ResponseEntity<>(new ResponseDto(1, "해당 반려동물의 정보입니다.", petDetailResponse), HttpStatus.OK);
    }
    @PostMapping("{petId}")
    public ResponseEntity<?> updatePet(@RequestBody @Valid PetUpdateRequest petUpdateRequest,
                                       BindingResult bindingResult,
                                       @AuthenticationPrincipal PrincipalDetails principalDetails) {

        petService.updatePet(petUpdateRequest, principalDetails.getAccount());

        return new ResponseEntity<>(new ResponseDto(1, "반려동물 정보 수정을 성공했습니다.", null), HttpStatus.OK);
    }

    @DeleteMapping("{petId}")
    public ResponseEntity<?> deletePet(@PathVariable @NotNull Long petId) {

        petService.deletePet(petId);

        return new ResponseEntity<>(new ResponseDto(1, "반려동물 삭제를 성공했습니다.", null), HttpStatus.OK);
    }

    @PostMapping(path = "/image")
    public ResponseEntity<?> updatePetProfileImage(@ModelAttribute @Valid PetProfileImageUpdateRequest petProfileImageUpdateRequest,
                                                   BindingResult bindingResult) {

        petService.updatePetProfileImage(petProfileImageUpdateRequest);

        return new ResponseEntity<>(new ResponseDto(1, "반려동물 프로필 이미지를 수정했습니다.", null), HttpStatus.OK);
    }

    @DeleteMapping("/image/{petId}")
    public ResponseEntity<?> deletePetProfileImage(@PathVariable @NotNull Long petId) {

        petService.deletePetProfileImage(petId);

        return new ResponseEntity<>(new ResponseDto(1, "반려동물 프로필 이미지를 기본 이미지로 변경했습니다..", null), HttpStatus.OK);
    }

    @GetMapping("/dog-species")
    public ResponseEntity<?> getDogSpecies() {
        List<PetSpeciesResponse> dogSpecies = petService.getDogSpecies();

        return new ResponseEntity<>(new ResponseDto<>(1, "강아지 품종 리스트", dogSpecies), HttpStatus.OK);
    }

    @GetMapping("/cat-species")
    public ResponseEntity<?> getCatSpecies() {
        List<PetSpeciesResponse> catSpecies = petService.getCatSpecies();

        return new ResponseEntity<>(new ResponseDto<>(1, "고양이 품종 리스트", catSpecies), HttpStatus.OK);
    }

    @GetMapping("/rabbit-species")
    public ResponseEntity<?> getRabbitSpecies() {
        List<PetSpeciesResponse> rabbitSpecies = petService.getRabbitSpecies();

        return new ResponseEntity<>(new ResponseDto<>(1, "토끼 품종 리스트", rabbitSpecies), HttpStatus.OK);
    }
}
