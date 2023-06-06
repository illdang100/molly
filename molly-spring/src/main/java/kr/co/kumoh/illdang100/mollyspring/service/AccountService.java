package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.image.AccountImage;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.image.AccountImageRepository;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshToken;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountRespDto.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountImageRepository accountImageRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final S3Service s3Service;

    /**
     * 닉네임 중복 검사
     * @param nickname 중복 검사를 원하는 닉네임
     */
    @Transactional(readOnly = true)
    public void checkNicknameDuplicate(String nickname) {

        Optional<Account> accountOpt = accountRepository.findByNickname(nickname);

        accountOpt.ifPresent((findAccount) -> {
            throw new CustomApiException("사용 불가능한 닉네임입니다.");
        });
    }

    /**
     * 회원가입 시 닉네임과 프로필 이미지 저장
     * @param accountId          회원가입을 원하는 사용자 pk
     * @param saveAccountRequest 사용자 닉네임과 프로필 이미지 정보가 담긴 request dto
     */
    @Transactional
    public void saveAdditionalAccountInfo(Long accountId, SaveAccountRequest saveAccountRequest){

        Account account = findAccountByIdOrThrowException(accountId);

        String nickname = saveAccountRequest.getNickname();

        checkNicknameDuplicate(nickname);
        account.changeNickname(nickname);

        if (saveAccountRequest.getAccountProfileImage() != null) {

            try {
                ImageFile accountImageFile =
                        s3Service.upload(saveAccountRequest.getAccountProfileImage(), FileRootPathVO.ACCOUNT_PATH);

                accountImageRepository.save(AccountImage.builder()
                        .account(account)
                        .accountProfileImage(accountImageFile)
                        .build());
            } catch (Exception e) {
                throw new CustomApiException(e.getMessage());
            }
        }
    }

    private Account findAccountByIdOrThrowException(Long accountId) {
        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 사용자입니다"));
        return account;
    }

    /**
     * 사용자 정보 조회
     * @param accountId 사용자 pk
     * @return 사용자 프로필 이미지, 닉네임, 이메일, 회원가입 경로
     */
    public AccountProfileResponse getAccountDetail(Long accountId) {

        Account account = findAccountByIdOrThrowException(accountId);

        String provider = getProviderFromUsername(account.getUsername());

        AccountProfileResponse accountProfileResponse = AccountProfileResponse.builder()
                .nickname(account.getNickname())
                .email(account.getEmail())
                .provider(provider)
                .build();

        Optional<AccountImage> accountImageOpt = accountImageRepository.findByAccount_id(accountId);
        accountImageOpt.map(AccountImage::getAccountProfileImage)
                .ifPresent(image -> accountProfileResponse.setProfileImage(image.getStoreFileUrl()));

        return accountProfileResponse;
    }

    @Transactional
    public void updateAccountNickname(Long accountId, String nickname) {

        Account account = findAccountByIdOrThrowException(accountId);

        checkNicknameDuplicate(nickname);
        account.changeNickname(nickname);
    }

    /**
     * 사용자 로그아웃 - 리프래시 토큰 삭제
     * @param refreshToken 리프래시 토큰
     */
    @Transactional
    public void deleteRefreshToken(String refreshToken) {

        Optional<RefreshToken> refreshTokenOpt = refreshTokenRedisRepository.findByRefreshToken(refreshToken);

        if (refreshTokenOpt.isPresent()) {
            log.debug("Refresh Token 삭제");
            RefreshToken findRefreshToken = refreshTokenOpt.get();
            refreshTokenRedisRepository.delete(findRefreshToken);
        }
    }

    private String getProviderFromUsername(String username) {
        int idx = username.indexOf('_');
        return username.substring(0, idx);
    }

    /**
     * 사용자 프로필 이미지 변경
     * @param accountProfileImage 변경하고자 하는 사용자 이미지
     */
    @Transactional
    public void updateAccountProfileImage(Long accountId, MultipartFile accountProfileImage) {

        Account account = findAccountByIdOrThrowException(accountId);

        Optional<AccountImage> accountImageOpt = accountImageRepository.findByAccount_id(accountId);

        try {
            ImageFile accountImageFile = s3Service.upload(accountProfileImage, FileRootPathVO.ACCOUNT_PATH);

            if (accountImageOpt.isPresent()) {
                AccountImage findAccountImage = accountImageOpt.get();
                s3Service.delete(findAccountImage.getAccountProfileImage().getStoreFileName());
                findAccountImage.changeProfileImage(accountImageFile);
            } else {
                accountImageRepository.save(AccountImage.builder()
                        .account(account)
                        .accountProfileImage(accountImageFile)
                        .build());
            }
        } catch (Exception e) {
            throw new CustomApiException(e.getMessage());
        }
    }

    /**
     * 사용자 프로필 이미지 삭제 (기본 이미지 변경)
     * @param accountId 사용자 pk
     */
    @Transactional
    public void deleteAccountProfileImage(Long accountId) {

        Optional<AccountImage> accountImageOpt = accountImageRepository.findByAccount_id(accountId);

        accountImageOpt.ifPresent(findAccountImage -> {
            s3Service.delete(findAccountImage.getAccountProfileImage().getStoreFileName());
            accountImageRepository.delete(findAccountImage);
        });
    }
}
