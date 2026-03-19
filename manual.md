# Kylin-PBC User Manual

Kylin-PBC is a periodic Density Functional Theory (DFT) program written in C++17. It uses
Gaussian-type orbital (GTO) basis sets with GTH pseudopotentials and evaluates Coulomb and
exchange integrals via Multigrid Density Fitting (MGDF) and FFT-based Density Fitting (FTDF).

Supported features:

- LDA, GGA, meta-GGA, hybrid, and range-separated hybrid exchange-correlation functionals (via Libxc)
- Gamma-point and Monkhorst-Pack k-point sampling
- Restricted closed-shell Kohn-Sham (RKS) and Hartree-Fock (HF)
- Adaptively Compressed Exchange (ACE) acceleration for hybrid functionals
- Occupation smearing (Gaussian, Fermi-Dirac, Methfessel-Paxton)
- Geometry optimization with BFGS / RFO / steepest descent

---

## Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `KYLIN_PBC_ROOT` | yes | Path to the project root. Used to locate `data/` (basis sets, pseudopotentials). |
| `KYLIN_SCR_PATH` | yes | Scratch directory for temporary files. |
| `KYLIN_JOB_PATH` | no  | Automatically set to the current working directory at startup. |

Example setup (bash):

```bash
export KYLIN_PBC_ROOT=/opt/kylin-pbc
export KYLIN_SCR_PATH=/scratch/$USER
export PATH=$KYLIN_PBC_ROOT/bin:$PATH
```

---

## Input Files

The program expects two files as inputs in the working directory.

### `cell.txt` -- Unit Cell

Defines the periodic cell and atomic positions. Coordinates are specified in **Angstrom**.

Format:

```
<a_x>  <a_y>  <a_z>        # lattice vector a
<b_x>  <b_y>  <b_z>        # lattice vector b
<c_x>  <c_y>  <c_z>        # lattice vector c
Cart | Frac                # coordinate type keyword
<Symbol>  <x>  <y>  <z>    # one line per atom
...
```

- `Cart` -- Cartesian coordinates (Angstrom).
- `Frac` -- Fractional coordinates.
- Lines starting with `#` and blank lines are ignored.

Example (silicon diamond):

```
3.8396000862    0.0000000000    0.0000000000
1.9198000431    3.3251912150    0.0000000000
1.9198000431    1.1083970717    3.1350203425
Cart
Si  0.000000000    0.000000000    0.000000000
Si  1.919800043    1.108397072    0.783755086
```

### `calc.txt` -- Control Parameters

Sets calculation parameters using a `key = value` format, one entry per line.

- Comments start with `#`.
- Numeric values that carry a physical dimension can include an optional unit suffix in square brackets: `value [unit]`.
- If no unit is specified, atomic units are assumed.
- Keys are case-insensitive.
- Duplicate keys cause an error.

Example:

```
SCF.xcfun           = PBE
SCF.basis           = gth-molopt-dzvp-sr
SCF.psudo           = gth-pbe
SCF.kmesh           = 2 2 2
SCF.max_cycle       = 100
SCF.eps_engy        = 1e-8 [eV]
SCF.hks_mix_method  = broy       # Broyden mixing on the Hamiltonian
SCF.smear_method    = fermi
SCF.smear_sigma     = 300 [K]
```

---

## Data Files

Located in `$KYLIN_PBC_ROOT/data/`. The program loads them automatically based on the
`SCF.basis` and `SCF.psudo` keywords.

| File | Description |
|:---|:---|
| `basis-<name>.cp2k` | Gaussian basis set in CP2K MOLOPT format. Default name: `gth-molopt-dzvp-sr`. |
| `psudo-<name>.cp2k` | GTH pseudopotentials in CP2K format. Default name: `gth-pbe`. |
| `ano.dat`           | ANO basis set (NWChem format), used internally for the MINAO initial guess. |

The basis file is resolved as `$KYLIN_PBC_ROOT/data/basis-{SCF.basis}.cp2k` and the
pseudopotential file as `$KYLIN_PBC_ROOT/data/psudo-{SCF.psudo}.cp2k`.

---

## Unit System

Numeric keywords that carry a physical dimension accept an optional `[unit]` suffix.
When no unit is given, atomic units (Hartree, Bohr) are assumed. Internally all values
are converted to atomic units upon loading.

| Dimension | Accepted Units | Notes |
|:---|:---|:---|
| Energy | `AU` (Hartree), `eV`, `K` (Kelvin) | 1 Hartree = 27.211 eV = 3.158 x 10^5 K |
| Length | `AU` (Bohr), `A` (Angstrom) | 1 Bohr = 0.5292 Angstrom |
| Force  | `AU` | Hartree/Bohr |

Unit names are case-insensitive. Partial-match aliases are supported:
`Angstrom` or `Ang` resolve to `A`; `Bohr` or `Hartree` resolve to `AU`.

---

## Keywords Reference -- SCF

### Basic Setup

| Keyword | Type | Default | Unit | Options | Description |
|:---|:---:|:---:|:---:|:---:|:---|
| `SCF.xcfun` | string | `LDA` | -- | (any Libxc name) | Exchange-correlation functional. Examples: `LDA`, `PBE`, `SCAN`, `B3LYP`, `PBE0`, `HSE06`, `HF`. |
| `SCF.ispin` | string | `OFF` | -- | `ON`, `OFF` | Unrestricted (open-shell) spin treatment. Currently only `OFF` (restricted) is implemented. |
| `SCF.basis` | string | `gth-molopt-dzvp-sr` | -- | (file name stem) | Basis set name. Resolved to `$KYLIN_PBC_ROOT/data/basis-<value>.cp2k`. |
| `SCF.psudo` | string | `gth-pbe` | -- | (file name stem) | Pseudopotential name. Resolved to `$KYLIN_PBC_ROOT/data/psudo-<value>.cp2k`. |
| `SCF.kmesh` | string | `1 1 1` | -- | (three integers) | Monkhorst-Pack k-point mesh. `1 1 1` triggers the gamma-point code path. |
| `SCF.gmesh` | real | `0.5` | -- | (0.0, 1.0] | Real-space grid density scaling factor. Smaller values give a coarser grid; `1.0` gives the maximum grid determined by the basis set kinetic energy cutoff. |

### Convergence Thresholds

| Keyword | Type | Default | Unit | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.eps_engy` | real | `1e-8` | energy | Energy convergence threshold. SCF is converged when &#124;E(n) - E(n-1)&#124; < eps_engy. |
| `SCF.eps_grad` | real | `1e-5` | force | Gradient (orbital gradient / commutator) convergence threshold. |
| `SCF.eps_dmat` | real | `1e-3` | -- | Density matrix convergence threshold (max element change). |

### Checkpoint

| Keyword | Type | Default | Description |
|:---|:---:|:---:|:---|
| `SCF.chk_load` | string | (empty) | Path to a checkpoint file to load initial density/wavefunction from. Empty = no load. |
| `SCF.chk_save` | string | (empty) | Path to save the converged density/wavefunction. Empty = no save. |

### SCF Algorithm

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.scf_guess` | string | `ATOM` | `NONE`, `ATOM` | Initial guess method. `ATOM` uses a MINAO superposition-of-atomic-densities guess. `NONE` starts from a zero density matrix. |
| `SCF.max_cycle` | integer | `100` | -- | Maximum number of SCF iterations. |

### Integral Methods

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.coul_method` | string | `MGDF` | `FTDF`, `MGDF` | Method for Coulomb (J) matrix and psudopotential matrix evaluation. `MGDF` = Multigrid Density Fitting (ref cp2k); `FTDF` = FFT-based Density Fitting. |
| `SCF.xchg_method` | string | `FTDF` | `FTDF`,  | Method for exact exchange (K) matrix evaluation. Only used for hybrid functionals. `PYSCF` delegates to PySCF's routines. |

### Exchange Options (Hybrid Functionals)

These keywords are only relevant when `SCF.xcfun` selects a hybrid or range-separated hybrid functional.

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.xchg_exxace` | string | `ON` | `ON`, `OFF` | Enable Adaptively Compressed Exchange (ACE) inner loop to accelerate hybrid SCF convergence. |  http://dx.doi.org/10.1021/acs.jctc.6b00092 (Lin lin)
| `SCF.xchg_choace` | string | `ON` | `ON`, `OFF` | If `ON`, use Cholesky decomposition in ACE. If `OFF`, the exchange matrix is frozen during the ACE inner loop. |  http://dx.doi.org/10.1021/acs.jctc.6b00092 (Lin lin)
| `SCF.xchg_ewaldx` | string | `ON` | `ON`, `OFF` | Apply Ewald divergence correction for the G=0 component of exact exchange. |

### Density Matrix Mixing

Controls mixing/extrapolation of the density matrix between SCF iterations. 

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.dmx_mix_method` | string | `NONE` | `NONE`, `BROY`, `DIIS` | Mixing method. `BROY` = Broyden; `DIIS` = Direct Inversion in the Iterative Subspace. `NONE` = no mixing. |
| `SCF.dmx_mix_start` | integer | `1` | -- | SCF iteration at which mixing begins. |
| `SCF.dmx_mix_space` | integer | `8` | -- | Number of history vectors kept for mixing. |
| `SCF.dmx_mix_alpha` | real | `0.3` | -- | Mixing parameter in (0, 1). `new' = alpha * new + (1 - alpha) * old`. |

### Electron Density Mixing

Controls mixing of the electron density (on the real-space grid).

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.rho_mix_method` | string | `NONE` | `NONE`, `BROY`, `DIIS` | Mixing method for the electron density. |
| `SCF.rho_mix_start` | integer | `1` | -- | Iteration at which mixing begins. |
| `SCF.rho_mix_space` | integer | `8` | -- | Number of history vectors. |
| `SCF.rho_mix_alpha` | real | `0.3` | -- | Mixing parameter. |

### Hamiltonian (Kohn-Sham Matrix) Mixing

Controls mixing of the Kohn-Sham / Fock matrix.

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.hks_mix_method` | string | `BROY` | `NONE`, `BROY`, `DIIS` | Mixing method for the Hamiltonian. Broyden mixing is enabled by default. |
| `SCF.hks_mix_start` | integer | `1` | -- | Iteration at which mixing begins. |
| `SCF.hks_mix_space` | integer | `8` | -- | Number of history vectors. |
| `SCF.hks_mix_alpha` | real | `0.3` | -- | Mixing parameter. |

### Damping and Level Shift

| Keyword | Type | Default | Unit | Description |
|:---|:---:|:---:|:---:|:---|
| `SCF.damp_factor` | real | `0.0` | -- | Damping factor for the density matrix update. `0.0` = no damping. |
| `SCF.level_shift` | real | `0.0` | energy | Level shift applied to virtual orbitals to improve convergence. `0.0` = no shift. |

### Occupation Smearing

| Keyword | Type | Default | Unit | Options | Description |
|:---|:---:|:---:|:---:|:---:|:---|
| `SCF.smear_method` | string | `NONE` | -- | `NONE`, `GAUSS`, `FERMI`, `METHF` | Smearing method for fractional occupations. `GAUSS` = Gaussian; `FERMI` = Fermi-Dirac; `METHF` = Methfessel-Paxton. |
| `SCF.smear_sigma` | real | `0.0` | energy | -- | Smearing width (electronic temperature). Typically set in Kelvin, e.g. `300 [K]`. |

---

## Keywords Reference -- OPT

Geometry optimization is activated by setting `OPT.max_cycle` to a value greater than zero.
When `OPT.max_cycle = 0` (the default), only a single-point SCF calculation is performed.

| Keyword | Type | Default | Unit | Options | Description |
|:---|:---:|:---:|:---:|:---:|:---|
| `OPT.opt_method` | string | `NEWTON` | -- | `NEWTON`, `STEEP` | Optimization algorithm. `NEWTON` uses BFGS quasi-Newton with approximate Hessian updates. `STEEP` uses steepest descent. |
| `OPT.max_cycle` | integer | `0` | -- | -- | Maximum optimization steps. `0` = SCF only (no optimization). |
| `OPT.eps_engy` | real | `1e-8` | energy | -- | Energy convergence threshold for optimization. |
| `OPT.eps_grad` | real | `1e-4` | force | -- | Maximum gradient component convergence threshold. |
| `OPT.trust_limit` | real | `0.3` | length | -- | Trust radius for the optimization step (Bohr by default). Steps exceeding this limit are scaled down. |
| `OPT.damp_factor` | real | `0.0` | -- | -- | Step damping factor. `0.0` = no damping. |

### Optimization Mixing

| Keyword | Type | Default | Options | Description |
|:---|:---:|:---:|:---:|:---|
| `OPT.opt_mix_method` | string | `NONE` | `NONE`, `GDIIS`, `GEDIIS` | Geometry extrapolation method between optimization steps. |
| `OPT.opt_mix_start` | integer | `1` | -- | Iteration at which mixing begins. |
| `OPT.opt_mix_space` | integer | `5` | -- | Number of history vectors. |
| `OPT.opt_mix_alpha` | real | `0.3` | -- | Mixing parameter. |

---

## Running the Program

1. Set environment variables (`KYLIN_PBC_ROOT`, `KYLIN_SCR_PATH`, `PATH`).
2. Create a working directory and place `cell.txt` and `calc.txt` in it.
3. Run the executable from that directory:

```bash
cd /path/to/job
kylin-pbc
```

### Dispatch Logic

The program chooses the calculation type and code path automatically:

- **SCF only** (`OPT.max_cycle = 0`, the default): performs a single-point self-consistent field calculation.
- **Geometry optimization** (`OPT.max_cycle > 0`): runs SCF at each geometry step, computes analytical gradients, and updates atomic positions.

Within SCF:

- **Gamma-point** (`SCF.kmesh = 1 1 1`): uses the `GRKS` (gamma-point restricted Kohn-Sham) solver with real-valued matrices.
- **K-point sampling** (any other `SCF.kmesh`): uses the `KRKS` (k-points restricted Kohn-Sham) solver with complex-valued matrices.

---

## Output

### Startup

The program prints its version, working directory, and all control parameters in atomic
units.

### SCF Iterations

Each SCF step prints three tagged lines:

```
[NELEC] step = N  nelec = M  neInt = ...  dnelc = ...
[ENERG] step = N  eTotl = ...  eCore = ...  eCoul = ...  eExcl = ...  eNucl = ...
[ERROR] step = N  engy error = ...  grad error = ...  dmat error = ...
```

| Tag | Content |
|:---|:---|
| `[NELEC]` | Electron count: formal `nelec`, integrated `neInt`, and their difference `dnelc`. |
| `[ENERG]` | Energy components: total (`eTotl`), one-electron core (`eCore`), Coulomb (`eCoul`), exchange-correlation (`eExcl`), nuclear repulsion (`eNucl`). All in Hartree. |
| `[ERROR]` | Convergence metrics: energy change, orbital gradient, density matrix change. |

For hybrid functionals with ACE enabled, additional `[ACE]` lines appear during the
inner loop:

```
[ACE] outer = N  inner = M  eTotl = ...  engy error = ...  dmat error = ...
```

On convergence: `SCF converged in N steps.`
On failure: `SCF didn't converge.`

### Geometry Optimization

Each optimization step prints:

```
[OPT] step = N  energy = ...  dE = ...  grad_max = ...  grad_rms = ...
```

Optimized cell files are written as `cell_opt_N.txt` in the working directory (Cartesian
coordinates, Angstrom, same format as `cell.txt`).

On convergence: `[OPT] Geometry optimization converged in N steps.`

---

## Examples

### Example 1: LDA Single-Point (Silicon, Gamma-Point)

`cell.txt`:

```
3.8396000862    0.0000000000    0.0000000000
1.9198000431    3.3251912150    0.0000000000
1.9198000431    1.1083970717    3.1350203425
Cart
Si  0.000000000    0.000000000    0.000000000
Si  1.919800043    1.108397072    0.783755086
```

`calc.txt`:

```
SCF.xcfun     = LDA
SCF.basis     = gth-molopt-dzvp-sr
SCF.psudo     = gth-pbe
SCF.max_cycle = 100
SCF.eps_engy  = 1e-9 [eV]
```

### Example 2: PBE with K-Point Sampling

`calc.txt`:

```
SCF.xcfun         = PBE
SCF.basis         = gth-molopt-dzvp-sr
SCF.psudo         = gth-pbe
SCF.kmesh         = 3 3 3
SCF.max_cycle     = 100
SCF.eps_engy      = 1e-8 [eV]
SCF.hks_mix_method = BROY
SCF.smear_method  = fermi
SCF.smear_sigma   = 300 [K]
```

### Example 3: HSE06 Hybrid Functional

`calc.txt`:

```
SCF.xcfun         = HSE06
SCF.basis         = gth-molopt-dzvp-sr
SCF.psudo         = gth-pbe
SCF.kmesh         = 2 2 2
SCF.max_cycle     = 100
SCF.eps_engy      = 1e-8 [eV]
SCF.xchg_method   = FTDF
SCF.xchg_exxace   = ON
SCF.hks_mix_method = BROY
```

### Example 4: Geometry Optimization

`calc.txt`:

```
SCF.xcfun         = PBE
SCF.basis         = gth-molopt-dzvp-sr
SCF.psudo         = gth-pbe
SCF.kmesh         = 2 2 2
SCF.max_cycle     = 100
SCF.eps_engy      = 1e-8 [eV]

OPT.opt_method    = NEWTON
OPT.max_cycle     = 50
OPT.eps_engy      = 1e-6 [eV]
OPT.eps_grad      = 1e-4
OPT.trust_limit   = 0.3
```


## References