# Troubleshooting

Due to a known bug in the upstream of meta-rust the Yocto/OE recipe for rust-cross may fail while building RVI SOTA Client or another application written in the Rust programming language. Until the complete resolution of the issue the workaround is to disable all use of the CXX11 ABI by applying the following lines to **conf/local.conf**:

```
LD_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
  
BUILD_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0" CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
```
