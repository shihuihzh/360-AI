#!/bin/bash

# check if bootx not exists extract from bootx.xz and keep bootx.xz
if [ ! -f bootx ]; then
    echo "bootx not found, extracting bootx.xz"
    unxz --stdout bootx.xz > bootx
    chmod a+x bootx
fi


sudo ./bootx -m leo -t u -c download 0x1180000 hack-rootfs.ubi


