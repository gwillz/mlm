
export default run;

/**
 * Execute suite on window load.
 */
export function run(target, cb) {
    const $output = document.querySelector(target);
    $output.innerText = '';

    // Document logger.
    function puts(...args) {
        $output.insertAdjacentText('beforeend', args.join(' '));
        $output.insertAdjacentHTML('beforeend', '<br>');
    }

    // Create and run the tests.
    const suite = new Suite(puts);
    window.addEventListener('load', suite.run.bind(suite, cb));
}

export class AssertError extends Error {
    name = 'AssertError';
}

/**
 * Test suite.
 */
export class Suite {
    constructor(puts = console.log) {
        // Stats.
        this.total = 0;
        this.passed = 0;

        // list of [ index, description, error ]
        this.errors = [];

        // Print function.
        this.puts = puts;
    }

    /**
     * Run a test.
     */
    run(cb) {
        this.puts('Running tests...');
        this.puts();

        this.time = +new Date() / 1000;

        // Run!
        cb(new Test(this));

        this.time = (+new Date() / 1000) - this.time;

        // Stats.
        this.puts('total:', this.total);
        this.puts('passed:', this.passed);
        this.puts('time:', this.time.toFixed(1) + 's');
        this.puts();

        // Errors.
        for (let [index, description, error] of this.errors) {
            this.puts(`Failed: (${index}) '${description}'`);
            this.puts('because:', error.message || 'Assertion failed');

            // Print where it occurred, while stripping any 'assert' frames.
            if (error.stack) {
                console.error(error.stack);
                let cause = '';

                error.stack.replace(/assert.*|([^/]+:\d+:\d+)/gm, (_, file) => {
                    if (!cause) cause = file;
                });

                this.puts('at:', cause || '??');
            }

            this.puts();
        }
    }
}

/**
 * Test case.
 */
function Test(suite) {
    // Assert dots - for illustrating how many have run.
    test.asserts = '';
    test.puts = suite.puts;
    return test;

    function test(description, cb) {
        suite.total++;
        suite.puts(`${suite.total}. ${description}`);

        // Run the test.
        try {
            cb(new Assert(test));

            // There were some asserts, good.
            if (test.asserts) {
                suite.passed++;
                suite.puts(test.asserts);
                suite.puts('OK');
            }
            // Less good.
            else {
                suite.puts('N/A - no tests');
            }
        }
        // Quite bad.
        catch (error) {
            suite.errors.push([suite.total, description, error]);
            suite.puts(test.asserts + 'E');
            suite.puts(`FAIL`);
        }

        suite.puts();
    }
}

/**
 * Assertions.
 */
function Assert(test) {
    // Clear test state.
    test.asserts = '';

    assert.equals = equals;
    return assert;

    function assert(condition, message = '') {
        // Yay.
        if (condition) {
            test.asserts += '.';
        }
        // Nay.
        else {
            throw new AssertError(message || '')
        }
    }

    function equals(expected, actual) {
        let message = `expected '${expected}' but was '${actual}'`;

        // Some hacks for comparing dates.
        if (expected instanceof Date) {
            expected = +expected;
        }

        if (actual instanceof Date) {
            actual = +actual;
        }

        // Strict comparisons.
        assert(expected === actual, message);
    }
}
