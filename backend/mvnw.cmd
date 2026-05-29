@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch Script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to enable pausing at the end of the script
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM     set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@REM Begin all REM lines with a blank line in between them, or MAVEN_BATCH_ECHO=on will echo them.
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@setlocal

@echo off
set ERROR_CODE=0

@REM To isolate internal variables from possible pre-existing env vars, reset them.
set MAVEN_COMMAND_ARGUMENTS=%*

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto init

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

@REM ==== END VALIDATION ====

:init

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
if not "%MAVEN_PROJECTBASEDIR%" == "" goto repoSetup

set MAVEN_PROJECTBASEDIR=%CD%

:findBaseDir
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" goto repoSetup
set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\..
if exist "%MAVEN_PROJECTBASEDIR%\pom.xml" goto findBaseDir

@REM set to current directory if give up
set MAVEN_PROJECTBASEDIR=%CD%

:repoSetup
@REM Safeguard the execution if maven wrapper jar doesn't exist
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if exist %WRAPPER_JAR% goto runWrapper

@REM Download wrapper jar if it doesn't exist
set DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper-distribution/3.3.2/maven-wrapper-distribution-3.3.2-bin.zip"
set WRAPPER_ZIP="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.zip"

if not exist "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" mkdir "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"

echo Device does not have wrapper jar, downloading...
@REM Downloading using powershell because certutil is unstable
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_ZIP%')"
powershell -Command "Expand-Archive -Path '%WRAPPER_ZIP%' -DestinationPath '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\temp' -Force"
move /Y "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\temp\*\.mvn\wrapper\maven-wrapper.jar" %WRAPPER_JAR%
rmdir /S /Q "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\temp"
del /F /Q %WRAPPER_ZIP%

:runWrapper
@REM Extension to allow automatically setting the JAVA_HOME
if not exist "%MAVEN_PROJECTBASEDIR%\.mavenrc_pre.bat" echo. > "%MAVEN_PROJECTBASEDIR%\.mavenrc_pre.bat"
call "%MAVEN_PROJECTBASEDIR%\.mavenrc_pre.bat"

set JVM_LAUNCHER="%JAVA_HOME%\bin\java.exe"

%JVM_LAUNCHER% %MAVEN_OPTS% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_COMMAND_ARGUMENTS%
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_BATCH_PAUSE%" == "on" goto quit
pause

:quit
exit /b %ERROR_CODE%