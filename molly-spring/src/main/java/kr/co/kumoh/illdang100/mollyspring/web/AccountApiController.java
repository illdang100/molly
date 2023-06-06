package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtVO;
import kr.co.kumoh.illdang100.mollyspring.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountRespDto.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class AccountApiController {

    private final AccountService accountService;

    /**
     * 사용자 닉네임 중복검사
     * @param inputNicknameRequest 사용자 닉네임
     */
    @PostMapping("/auth/account/duplicate")
    public ResponseEntity<?> checkNickname(@RequestBody @Valid InputNicknameRequest inputNicknameRequest,
                                           BindingResult bindingResult) {

        String nickname = inputNicknameRequest.getNickname();
        accountService.checkNicknameDuplicate(nickname);

        return new ResponseEntity<>(new ResponseDto<>(1, "사용 가능한 닉네임입니다", null), HttpStatus.OK);
    }

    /**
     * 추가 회원가입 절차 진행
     * @param saveAccountRequest 사용자 정보(프로필 이미지, 닉네임)
     * @param principalDetails 인증된 사용자 정보
     */
    @PostMapping("/auth/account/save")
    public ResponseEntity<?> completeRegistration(@ModelAttribute @Valid SaveAccountRequest saveAccountRequest,
                                                  BindingResult bindingResult,
                                                  @AuthenticationPrincipal PrincipalDetails principalDetails) {

        accountService.saveAdditionalAccountInfo(principalDetails.getAccount().getId(), saveAccountRequest);

        return new ResponseEntity<>(new ResponseDto<>(1, "추가정보 기입 완료", null), HttpStatus.OK);
    }

    /**
     * 사용자 정보 조회
     * @param principalDetails 인증된 사용자 정보
     * @return 조회한 사용자 정보
     */
    @GetMapping("/auth/account")
    public ResponseEntity<?> getAccountProfile(@AuthenticationPrincipal PrincipalDetails principalDetails) {

        AccountProfileResponse accountProfileResponse =
                accountService.getAccountDetail(principalDetails.getAccount().getId());

        return new ResponseEntity<>(new ResponseDto<>(1, "사용자 정보 조회 성공", accountProfileResponse), HttpStatus.OK);
    }

    /**
     * 사용자 로그아웃
     * @param refreshToken 리프래시 토큰
     */
    @DeleteMapping("/account/logout")
    public ResponseEntity<?> logout(@RequestHeader(JwtVO.REFRESH_TOKEN_HEADER) String refreshToken) {

        accountService.deleteRefreshToken(refreshToken);

        return new ResponseEntity<>(new ResponseDto<>(1, "로그아웃 성공", null), HttpStatus.OK);
    }

    /**
     * 사용자 프로필 정보(닉네임) 변경
     * @param inputNicknameRequest 변경하고 싶은 닉네임
     * @param principalDetails 인증된 사용자 정보
     */
    @PostMapping("/auth/account/nickname")
    public ResponseEntity<?> updateAccountProfile(@RequestBody @Valid InputNicknameRequest inputNicknameRequest,
                                                  BindingResult bindingResult,
                                                  @AuthenticationPrincipal PrincipalDetails principalDetails) {

        accountService.updateAccountNickname(principalDetails.getAccount().getId(), inputNicknameRequest.getNickname());

        return new ResponseEntity<>(new ResponseDto<>(1, "닉네임 수정 완료", null), HttpStatus.OK);
    }

    /**
     * 사용자 프로필 이미지를 다른 이미지로 변경
     * @param accountProfileImage 변경하고 싶은 이미지
     * @param principalDetails 인증된 사용자 정보
     */
    @PatchMapping("/auth/account/profile-image")
    public ResponseEntity<?> updateAccountProfileImage(@RequestParam("accountProfileImage") MultipartFile accountProfileImage,
                                                       @AuthenticationPrincipal PrincipalDetails principalDetails) {

        accountService.updateAccountProfileImage(principalDetails.getAccount().getId(), accountProfileImage);

        return new ResponseEntity<>(new ResponseDto<>(1, "사용자 이미지 수정 완료", null), HttpStatus.OK);
    }

    /**
     * 사용자 프로필 이미지를 기본 이미지로 변경
     * @param principalDetails 인증된 사용자 정보
     */
    @DeleteMapping("/auth/account/profile-image")
    public ResponseEntity<?> deleteAccountProfileImage(@AuthenticationPrincipal PrincipalDetails principalDetails) {

        accountService.deleteAccountProfileImage(principalDetails.getAccount().getId());

        return new ResponseEntity<>(new ResponseDto<>(1, "기본 이미지 변경 완료", null), HttpStatus.OK);
    }
}
