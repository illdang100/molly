package kr.co.kumoh.illdang100.mollyspring.dto.board;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class BoardRespDto {

    @AllArgsConstructor
    @Getter @Setter
    public static class CreatePostResponse {
        private Long boardId;
    }

    @AllArgsConstructor
    @Getter @Setter
    public static class RetrievePostListDto {
        private Long boardId;
        private String title;
        private String writerNick;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private LocalDateTime createdAt;
        private String content;
        private long views;
        private long commentCount;
        private long likyCount;
        private boolean hasImage;
        private boolean isNotice;
    }

    @AllArgsConstructor
    @Builder
    @Getter @Setter
    public static class PostDetailResponse {
        private boolean boardOwner;
        private String title;
        private String category;
        private String petType;
        private String content;
        private String writerNick;
        private String writerEmail;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private LocalDateTime createdAt;
        private long views;
        private String writerProfileImage;
        private List<BoardCommentDto> comments;
        private boolean thumbsUp;
        private long likyCnt;
    }

    @AllArgsConstructor
    @Builder
    @Getter @Setter
    public static class BoardCommentDto {
        private Long commentId;
        private boolean commentOwner;
        private String commentAccountEmail;
        private String commentWriteNick;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private LocalDateTime commentCreatedAt;
        private String content;
        private String commentProfileImage;
    }

    @AllArgsConstructor
    @Getter @Setter
    public static class LikyBoardResponse {
        private long likyCount;
        private boolean thumbsUp;
        @JsonIgnore
        private String message;
    }

    @Getter @Setter
    public static class AddBoardImageResponse {
        private Long boardImageId;
        private String storedBoardImageUrl;
    }
}
