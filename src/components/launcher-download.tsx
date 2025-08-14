import { Button, DownloadTrigger, FormatByte } from "@chakra-ui/react"
import { LuDownload } from "react-icons/lu"

const SITE_URL = "https://injectorlab.github.io/"

function isMacOS(): boolean {
    if (typeof navigator === "undefined") return false
    const ua = navigator.userAgent || ""
    const plat = (navigator as any).platform || ""
    return /Macintosh|Mac OS X|Mac OS|MacIntel|MacPPC|Mac/i.test(ua) || /Mac/i.test(plat)
}

function buildWindowsCmd(url: string): string {
    const EOL = "\r\n"
    return [
        "@echo off",
        "REM ------------------------------------------",
        "REM Chrome Launcher for Windows",
        "REM Allows insecure content for local WS testing",
        "REM ------------------------------------------",
        "",
        "setlocal",
        `set "URL=${url}"`,
        "",
        "REM --- Possible Chrome installation paths ---",
        `set "C1=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"`,
        `set "C2=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"`,
        `set "C3=%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe"`,
        "",
        "REM --- Try each path, else fallback to PATH ---",
        `if exist "%C1%" ("%C1%" --allow-running-insecure-content --new-window "%URL%") ^`,
        `else if exist "%C2%" ("%C2%" --allow-running-insecure-content --new-window "%URL%") ^`,
        `else if exist "%C3%" ("%C3%" --allow-running-insecure-content --new-window "%URL%") ^`,
        `else (start "" chrome --allow-running-insecure-content --new-window "%URL%")`,
        "",
        "REM --- End ---",
        "",
    ].join(EOL)
}

function buildAppleScript(url: string): string {
    return `-- Chrome Launcher for macOS
-- Allows insecure content for local WS testing

do shell script "open -na 'Google Chrome' --args --allow-running-insecure-content --new-window '${url}'"
`
}

export default function LauncherDownloadButton() {
    const mac = isMacOS()
    const fileName = mac ? "launch-chrome.applescript" : "launch-chrome.cmd"
    const mimeType = "text/plain"

    const script = mac ? buildAppleScript(SITE_URL) : buildWindowsCmd(SITE_URL)

    return (
        <DownloadTrigger data={script} fileName={fileName} mimeType={mimeType} asChild>
            <Button variant="outline">
                <LuDownload /> Лаунчер (<FormatByte value={script.length} unitDisplay="narrow" />)
            </Button>
        </DownloadTrigger>
    )
}