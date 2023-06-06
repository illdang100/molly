package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.board.Board;
import kr.co.kumoh.illdang100.mollyspring.domain.image.BoardImage;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.board.BoardRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.image.BoardImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.board.BoardReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.board.BoardRespDto.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final AccountRepository accountRepository;
    private final BoardRepository boardRepository;
    private final S3Service s3Service;
    private final BoardImageRepository boardImageRepository;

    @Transactional
    public CreatePostResponse createPost(Long accountId, CreatePostRequest createPostRequest) {

        Account findAccount = findAccountByIdOrThrowException(accountId);

        Board board = boardRepository.save(new Board(findAccount, createPostRequest));

        // 게시글 이미지 저장
        List<MultipartFile> boardImages = createPostRequest.getBoardImages();
        if (!boardImages.isEmpty()) {
            for (MultipartFile boardImage : boardImages) {
                try {
                    saveBoardImage(board, boardImage);
                } catch (Exception e) {
                    throw new CustomApiException(e.getMessage());
                }
            }
        }

        return new CreatePostResponse(board.getId());
    }

    // TODO: 게시글 전체 리스트 조회 (페이징)
    public void getPostList() {

    }

    // TODO: 게시글 상세조회
    public void getPostDetail() {

    }

    // TODO: 좋아요
    @Transactional
    public void toggleLikePost() {

    }

    // TODO: 게시글 수정
    @Transactional
    public void updatePost() {

    }

    // TODO: 게시글 삭제
    @Transactional
    public void deletePost() {

    }

    private void saveBoardImage(Board board, MultipartFile boardImage) throws IOException {
        ImageFile boardImageFile =
                s3Service.upload(boardImage, FileRootPathVO.BOARD_PATH);

        boardImageRepository.save(BoardImage.builder()
                .board(board)
                .accountProfileImage(boardImageFile)
                .build());
    }

    private Account findAccountByIdOrThrowException(Long accountId) {
        return accountRepository
                .findById(accountId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 사용자입니다"));
    }
}
