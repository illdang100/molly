#!/usr/bin/env bash

# bash는 값을 리턴할 수 없으므로 echo로 결과를 출력하여 클라이언트에서 값을 사용한다

# 쉬고 있는 profile 찾기
function find_sleep_profile()
{
    # 현재 엔진엑스가 바라보는 스프링 부트의 정상 수행 여부 확인 -> HttpStatus
    RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/profile)

    if [ ${RESPONSE_CODE} -ge 400 ] # 400 보다 크면 (즉, 40x/50x 에러 모두 포함)
    then
        CURRENT_PROFILE=dev-2 # 정상적으로 수행 중이지 않을 경우
    else
        CURRENT_PROFILE=$(curl -k -s https://localhost/profile)
    fi

    if [ ${CURRENT_PROFILE} == dev-1 ]
    then
      IDLE_PROFILE=dev-2 # 엔진엑스랑 연결되지 않은 profile
    else
      IDLE_PROFILE=dev-1
    fi

    echo "${IDLE_PROFILE}" # 마지막에 echo를 통해 출력하여 클라이언트가 값을 사용할 수 있도록 한다
}

# 쉬고 있는 profile의 port 찾기
function find_sleep_port()
{
    IDLE_PROFILE=$(find_sleep_profile)

    if [ ${IDLE_PROFILE} == dev-1 ]
    then
      echo "5000"
    else
      echo "5001"
    fi
}