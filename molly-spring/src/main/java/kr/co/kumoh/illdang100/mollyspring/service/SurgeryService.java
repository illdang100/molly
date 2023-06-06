package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryRespDto.SurgeryResponse;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.surgery.SurgeryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto.*;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SurgeryService {

    private final SurgeryRepository surgeryRepository;
    private final PetRepository petRepository;

    /**
     * 수술 이력 추가
     * @param request
     * @return
     */
    @Transactional
    public Long saveSurgery (SurgerySaveRequest request) {

        Long petId = request.getPetId();
        Pet findPet = findPetOrElseThrow(petId);

        String surgeryName = request.getSurgeryName();
        LocalDate surgeryDate = request.getSurgeryDate();
        Boolean exists = existSurgeryByPet(petId, surgeryName, surgeryDate);
        if (exists == Boolean.TRUE) throw new CustomApiException("해당 수술 이력이 이미 존재합니다.");

        SurgeryHistory surgery = SurgeryHistory.builder()
                .pet(findPet)
                .surgeryName(surgeryName)
                .surgeryDate(surgeryDate)
                .build();

        surgeryRepository.save(surgery);

        return surgery.getId();
    }

    /**
     * 수술 이력 조회
     * @param petId
     * @return
     */
    public List<SurgeryResponse> viewSurgeryList(Long petId) {

        List<SurgeryHistory> sHistory = surgeryRepository.findByPet_IdOrderBySurgeryDateAsc(petId);
       if (sHistory == null) throw new CustomApiException("수술 이력이 존재하지 않습니다");
       return sHistory.stream()
               .map(s -> new SurgeryResponse(s.getId(), s.getSurgeryName(), s.getSurgeryDate()))
               .collect(Collectors.toList());
    }

    /**
     * 수술 이력 수정
     * @param request
     */
    @Transactional
    public void updateSurgery(SurgeryUpdateRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long surgeryId = request.getSurgeryId();
        SurgeryHistory surgery = findSurgeryOrElseThrow(surgeryId);

        surgery.updateSurgery(request);
    }

    /**
     * 수술 이력 삭제
     * @param request
     */
    @Transactional
    public void deleteSurgery(SurgeryDeleteRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long surgeryId = request.getSurgeryId();
        findSurgeryOrElseThrow(surgeryId);

        surgeryRepository.deleteById(surgeryId);
    }
    private SurgeryHistory findSurgeryOrElseThrow(Long surgeryId) {
        return surgeryRepository.findById(surgeryId)
                .orElseThrow(() -> new CustomApiException("수술 이력이 존재하지 않습니다."));
    }
    private Boolean existSurgeryByPet(Long petId, String surgeryName, LocalDate surgeryDate) {
        return surgeryRepository.existSurgeryByPet(petId, surgeryName, surgeryDate);
    }
    public Pet findPetOrElseThrow(Long petId) {

        return petRepository.findById(petId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 반려동물입니다."));
    }
}
