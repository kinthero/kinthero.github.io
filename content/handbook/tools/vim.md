+++
title = 'vim'
+++
# vim

编辑文件 `~/.vimrc` 。

```conf
" ── General ──────────────────────────────────────────

set history=500
filetype plugin indent on

let mapleader = " "

" ── UI ────────────────────────────────────────────────

set number
set scrolloff=5
set wildmenu
set noerrorbells

" ── Search ────────────────────────────────────────────

set ignorecase
set smartcase
set incsearch
set hlsearch

" ── Editing ───────────────────────────────────────────

set expandtab
set shiftwidth=4
set tabstop=4
set autoindent

" ── Files ─────────────────────────────────────────────

set fileformats=unix,dos,mac

" ── fzf ───────────────────────────────────────────────

let s:plugin_dir = expand("~/.vim/plugged")

function! s:ensure(repo) abort
    let name = split(a:repo, "/")[-1]
    let path = s:plugin_dir . "/" . name

    if !isdirectory(path)
        call mkdir(s:plugin_dir, "p")
        call system("git clone --depth=1 https://github.com/"
                    \ . a:repo . " " . shellescape(path))
    endif

    execute "set runtimepath+=" . fnameescape(path)
endfunction

call s:ensure("junegunn/fzf")
call s:ensure("junegunn/fzf.vim")

" ── Mappings ───────────────────────────────────────────

inoremap jk <Esc>
nnoremap H :bprevious<CR>
nnoremap L :bnext<CR>
nnoremap <leader><leader> :Files<CR>
nnoremap <Esc><Esc> :nohlsearch<CR>

" ── Last edit position ────────────────────────────────

augroup vimrc
    autocmd!
    autocmd BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") |
        \ execute "normal! g`\"" |
        \ endif
augroup END
```


