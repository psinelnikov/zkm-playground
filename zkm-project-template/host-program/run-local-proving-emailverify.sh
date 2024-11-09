if [ $# -lt 1 ]; then
    echo "usage: ./run_local_proving sha2-go [or sha2-rust, mem-alloc-vec, revme, or emailverify-go]"
    exit 1
fi

set -e
BASEDIR=$(cd $(dirname $0); pwd)
export LD_LIBRARY_PATH=$BASEDIR/../sdk/src/local/libsnark:$LD_LIBRARY_PATH  ##Modify it according your template
export ZKM_PROVER=local
export RUST_LOG=info
export SEG_SIZE=32768
export ARGS="$@"
#export ARGS="711e9609339e92b03ddc0a211827dba421f38f9ed8b9d806e1ffdd8c15ffa03d world!"
export ELF_PATH=${BASEDIR}/../guest-program/emailverify-go/target/mips-unknown-linux-musl/release/emailverify-go
export JSON_PATH=${BASEDIR}/test-vectors/test.json
export PROOF_RESULTS_PATH=${BASEDIR}/../contracts
export EXECUTE_ONLY=false

echo "Compile guest-program emailverify-go"
cd $BASEDIR/../guest-program/emailverify-go
GOOS=linux GOARCH=mips GOMIPS=softfloat go build -o emailverify-go
export ELF_PATH=${BASEDIR}/../guest-program/emailverify-go/emailverify-go

cd ${BASEDIR}

echo "SEG_SIZE:$SEG_SIZE"
echo "BASEDIR:$BASEDIR"

nohup ../target/release/zkm-prove emailverify-go >./emailverify-go-local-proving.log 2>&1
#echo "Check out the log by tail -f $program-local-proving.log"
